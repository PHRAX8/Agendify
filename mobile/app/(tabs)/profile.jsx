import { useEffect, useState } from 'react';
import { View, Alert, Text } from 'react-native';
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/profile.styles";
import ProfileHeader from '../../components/ProfileHeader';
import LogoutButton from '../../components/LogoutButton';

export default function Profile() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { token } = useAuthStore();

  const router = useRouter();

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`https://agendify-ov1e.onrender.com/api/service/user`, {
        headers: { Authorization: `Bearer ${token}`},
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch user services");

      setServices(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load profile data. Pull down to refresh.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ProfileHeader servicesCount={services.length}/>
      <LogoutButton/>
    </View>
  )
}