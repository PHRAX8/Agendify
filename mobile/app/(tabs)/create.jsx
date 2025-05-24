import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, ScrollView, TextInput, Platform, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import styles from "../../assets/styles/create.styles";
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { useAuthStore } from "../../store/authStore"

export default function Create() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState(""); // maybe change to enum
  const [price, setPrice] = useState("10.00");
  const [isLoading, setIsLoading] = useState(false);
  const [client, setClient] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("") // change to enum

  const router = useRouter();
  const { token } = useAuthStore();

  const handleSubmit = async () => {
    if (!title || !caption || !client || !price || !paymentMethod ) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`https://agendify-ov1e.onrender.com/api/service`, {
        method:"POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",

        },
        body: JSON.stringify({
          title,
          caption,
          client,
          price,
          paymentMethod,
        }),
      })

      //const rawResponse = await response.text();
      //console.log("Raw API response:", rawResponse);
      //console.log("t:", title);
      //console.log("c:", caption);
      //console.log("p:", price);
      //console.log("cl:", client);
      //console.log("pm:", paymentMethod);

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      Alert.alert("Success", "Your service has been saved!");
      setTitle("");
      setCaption("");
      setClient("");
      setPrice(10.00);
      setPaymentMethod("");
      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", error.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Service</Text>
            <Text style={styles.subtitle}>All your work in one place</Text>
          </View>

          {/* Title */}
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="pencil-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter service title"
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Your Payment method</Text>
            <View style={styles.inputContainer}>
                <Ionicons
                  name="card-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter payment method"
                  placeholderTextColor={COLORS.placeholderText}
                  value={paymentMethod}
                  onChangeText={setPaymentMethod}
                />
              </View>
          </View>

          {/* Price */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Your Price</Text>
            <View style={styles.inputContainer}>
                <Ionicons
                  name="cash-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter price"
                  placeholderTextColor={COLORS.placeholderText}
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
          </View>

          {/* Client */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Your Client</Text>
            <View style={styles.inputContainer}>
                <Ionicons
                  name="person-add-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter client name"
                  placeholderTextColor={COLORS.placeholderText}
                  value={client}
                  onChangeText={setClient}
                />
              </View>
          </View>

          {/* Caption */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Caption</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Write your service description here!"
              placeholderTextColor={COLORS.placeholderText}
              value={caption}
              onChangeText={setCaption}
              multiline
            />
          </View>

          {/* Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons
                name="cloud-upload-outline"
                size={20}
                color={COLORS.white}
                style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Save</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}