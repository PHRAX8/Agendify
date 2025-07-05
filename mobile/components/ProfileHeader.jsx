import { View, Text } from 'react-native'
import { useAuthStore } from '../store/authStore'
import { Image } from "expo-image";
import styles from "../assets/styles/profile.styles";
import { formatPublishDate } from "../lib/utils";

export default function ProfileHeader({ servicesCount }) {
    const {user} = useAuthStore();

    if (!user) return null;

  return (
    <View style={styles.profileHeader}>
        <Image source={{ uri: user.profileImage }} style={styles.profileImage}/>

        <View style={styles.profileInfo}>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.servicesCount}>{servicesCount} services saved</Text>
            <Text style={styles.memberSince}>📅 Joined {formatPublishDate(user.createdAt)}</Text>
        </View>
    </View>
  )
}