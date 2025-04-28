import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import * as cookie from "cookie";
import styles from "./Profile.module.css";

export function Profile() {
    const { isLoggedIn } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [friendCodeInput, setFriendCodeInput] = useState("");
    const [addFriendStatus, setAddFriendStatus] = useState("");

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch("/profile_data/", {
                    credentials: "same-origin",
                });

                if (res.ok) {
                    const data = await res.json();
                    setProfileData(data);
                } else {
                    console.error("Failed to fetch profile data");
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        }

        if (isLoggedIn) {
            fetchProfile();
        }
    }, [isLoggedIn]);

    async function handleAddFriend(e) {
        e.preventDefault();

        try {
            const res = await fetch("/add_friend/", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ friend_key: friendCodeInput }),
            });

            if (res.ok) {
                const newFriend = await res.json(); // Expect the server to return friend's details
                setAddFriendStatus("Friend added successfully!");
                setFriendCodeInput(""); // clear input

                // Update the friends list in state without refetching
                setProfileData(prev => ({
                    ...prev,
                    friends: [...prev.friends, {
                        first_name: newFriend.first_name,
                        last_name: newFriend.last_name,
                        friend_key: newFriend.friend_key
                    }],
                    friends_count: prev.friends_count + 1
                }));

            } else {
                const data = await res.json();
                setAddFriendStatus(`Error: ${data.error || "Could not add friend"}`);
            }
        } catch (error) {
            console.error("Error adding friend:", error);
            setAddFriendStatus("An error occurred while adding friend.");
        }
    }

    if (!profileData) {
        return (
            <div className={styles.container}>
                <h1>Profile</h1>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Profile</h1>

            <div className={styles.section}>
                <p><strong>Name:</strong> {profileData.first_name} {profileData.last_name}</p>
                <p><strong>Friend Code:</strong> {profileData.friend_key}</p>
                <p><strong>Books Read:</strong> {profileData.read_count}</p>
            </div>

            <div className={styles.section}>
                <h2>Friends ({profileData.friends_count})</h2>
                <ul className={styles.friendList}>
                    {profileData.friends.map((friend, index) => (
                        <li key={index} className={styles.friendItem}>
                            {friend.first_name} {friend.last_name} <span className={styles.friendCode}>(Code: {friend.friend_key})</span>
                        </li>
                    ))}
                </ul>
            </div>

            <form onSubmit={handleAddFriend} className={styles.form}>
                <h2>Add Friend</h2>
                <input
                    type="text"
                    placeholder="Enter friend's code"
                    value={friendCodeInput}
                    onChange={(e) => setFriendCodeInput(e.target.value)}
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>Add Friend</button>
            </form>

            {addFriendStatus && <p className={styles.statusMessage}>{addFriendStatus}</p>}
        </div>
    );
}