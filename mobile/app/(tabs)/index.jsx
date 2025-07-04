import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import { useAuthStore } from '../../store/authStore'
import { useEffect, useState } from 'react';

import styles from "../../assets/styles/home.styles"
import { formatPublishDate } from '../../lib/utils';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import Loader from '../../components/Loader';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

      //setServices((prevServices) => [...prevServices, ...data.services]);

      const uniqueServices = 
        refresh || pageNum === 1
          ? data.services
          : Array.from(new Set([...services, ...data.services].map((service) => service._id))).map((id) => [...services, data.services].find((service) => service._id === id));
      
          setServices(uniqueServices);

      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);

    } catch (error) {
      console.log("Error fetching services", error);
    } finally {
      if(refresh) {
        await sleep(800);
        setRefreshing(false);
      }
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices()
  }, []);

  const handleLoadMore = async () => {
    if(hasMore && !loading && !refreshing) {
      await fetchServices(page + 1);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.serviceCard}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>Created at: {formatPublishDate(item.createdAt)}</Text>
      <Text style={styles.caption}>{item.caption}</Text>
      <Text style={styles.price}>R$ {item.price}</Text>
      <Text style={styles.client}>{item.client}</Text>
      <Text style={styles.paymentMethod}>{item.paymentMethod}</Text>
    </View>
  )

  if(loading) return <Loader/>
  

  return (
    <View style={styles.container}>
      <FlatList
        data={services}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchServices(1, true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }

        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Agendify📝</Text>
            <Text style={styles.headerSubtitle}>Never Forget your Business</Text>
          </View>
        }

        ListFooterComponent={
          hasMore && services.length > 0 ? (
            <ActivityIndicator style={styles.footerLoader} size="small" color={COLORS.primary}/>
          ) : null
        }

        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="reader-outline" size={60} color={COLORS.textSecondary}/>
            <Text style={styles.emptyText}>No Services yet</Text>
            <Text style={styles.emptySubtext}>Start right Now!</Text>
          </View>
        }
      />
    </View>
  )
}