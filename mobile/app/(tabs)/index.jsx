import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native'
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
  const [deletedServiceId, setDeleteServiceId] = useState(null);

  const fetchServices = async (pageNum=1, refresh=false) => {
    try {
      if(refresh) setRefreshing(true);
      else if(pageNum===1) setLoading(true);

      const response = await fetch(`https://agendify-ov1e.onrender.com/api/service?page=${pageNum}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if(!response.ok) throw new Error(data.message || "Failed to fetch services");

      
      const validServices = data.services?.filter(service => service?._id) || [];
    
    setServices(prev => {
      if (refresh || pageNum === 1) {
        return validServices;
      }
      // Merge and deduplicate
      const merged = [...prev, ...validServices];
      return merged.filter((service, index, self) => 
        index === self.findIndex(s => s._id === service._id)
      );
    });

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

  const handleDeleteService = async (serviceId) => {
    setDeleteServiceId(serviceId);
    try {
      const response = await fetch(`https://agendify-ov1e.onrender.com/api/service/${serviceId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json();
      if(!response.ok) throw new Error(data.message || "Failed to delete service");

      setServices(services.filter((service) => service._id !== serviceId));
      Alert.alert("Success", "Recommendation deleted successfully");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to delete service");
    } finally {
      setDeleteServiceId(null);
    }
  };

  const confirmDelete = (serviceId) => {
    Alert.alert("Delete Service", "Are you sure you want to delete this service? This action can't be undone!", [
      {text: "Cancel", style: "cancel"},
      {text: "Delete", style: "destructive", onPress: () => handleDeleteService(serviceId)},
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.serviceCard}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>Created at: {formatPublishDate(item.createdAt)}</Text>
      <Text style={styles.caption}>{item.caption}</Text>
      <Text style={styles.price}>R$ {item.price}</Text>
      <Text style={styles.client}>{item.client}</Text>
      <Text style={styles.paymentMethod}>{item.paymentMethod}</Text>
        
      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
        {deletedServiceId === item._id ? (<ActivityIndicator size="small" color={COLORS.primary}/>) : (<Ionicons name="trash-outline" size={20} color={COLORS.primary}/>)}
      </TouchableOpacity>
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
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Text style={styles.addButtonText}>Start right Now!</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  )
}