import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { useAuthStore } from '../../store/authStore'
import { useEffect, useState } from 'react';

import styles from "../../assets/styles/home.styles"

export default function Home() {
  const { token } = useAuthStore();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchServices = async (pageNum=1, refresh=false) => {
    try {
      if(refresh) setRefreshing(true);
      else if(pageNum===1) setLoading(true);

      const response = await fetch(`https://agendify-ov1e.onrender.com/api/service?page=${pageNum}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if(!response.ok) throw new Error(data.message || "Failed to fetch services");

      setServices((prevServices) => [...prevServices, ...data.services]);

      setHasMore(pageNum < data.totalPages);

      setPage(pageNum);
    } catch (error) {
      console.log("Error fetching services", error);
    } finally {
      if(refresh) setRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices()
  }, []);

  const handleLoadMore = async () => {

  };

  const renderItem = ({ item }) => (
    <View style={styles.serviceCard}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>R$ {item.price}</Text>
      <Text style={styles.client}>{item.client}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={services}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}