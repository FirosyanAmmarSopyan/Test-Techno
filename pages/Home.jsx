import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Modal from "react-native-modal";

export default function HomeScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bannerIndex, setBannerIndex] = useState(0);
  const scrollRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);

  const handleQRCodePress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prevIndex) =>
        prevIndex === userData.banner.length - 1 ? 0 : prevIndex + 1
      );
      scrollRef.current.scrollTo({ x: bannerIndex * 320, animated: true });
    }, 2000);

    return () => clearInterval(interval);
  }, [userData]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");

        const response = await axios.get("https://soal.staging.id/api/home", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data.result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prevIndex) =>
        prevIndex === userData.banner.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [userData]);

  return (
    <>
      <View style={styles.AndroidSafeArea}>
        <View>
          <Image
            source={require("../assets/logo-technopartner.png")}
            style={styles.image}
          />
        </View>
        <ImageBackground
          style={{ padding: 15 }}
          source={require("../assets/motif.png")}
        >
          <View style={styles.Card}>
            <Text style={{ fontSize: 16, paddingBottom: 5 }}>
              {userData?.greeting}
            </Text>
            <Text
              style={{ fontSize: 16, fontWeight: "bold", paddingBottom: 7 }}
            >
              {userData?.name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <TouchableOpacity
                onPress={handleQRCodePress}
                style={{ borderRadius: 100, elevation: 5 }}
              >
                <Image
                  source={{ uri: userData?.qrcode }}
                  style={{ width: 70, height: 70, borderRadius: 100 }}
                />
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={handleCloseModal}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                  >
                    <Text style={{marginVertical:10 , fontSize :18 , color : 'white'}}>
                      Show the QR Code below to the cashier
                    </Text>
                    <Image
                      source={{ uri: userData?.qrcode }}
                      style={{ width: 250, height: 250 }}
                    />
                    <TouchableOpacity onPress={handleCloseModal}>
                      <Text style={{marginVertical:20 , fontSize:20 , color:"white"}}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>  
              </TouchableOpacity>
              <View style={{ marginHorizontal: 20 }}>
                <Text style={{ marginVertical: 3, fontSize: 15 }}>Saldo</Text>
                <Text style={{ marginVertical: 3, fontSize: 15 }}>Points</Text>
              </View>
              <View>
                <Text
                  style={{
                    marginVertical: 3,
                    fontSize: 15,
                    alignSelf: "flex-end",
                    fontWeight: "bold",
                  }}
                >
                  Rp. {userData?.saldo}
                </Text>
                <Text
                  style={{
                    marginVertical: 3,
                    fontSize: 15,
                    alignSelf: "flex-end",
                    fontWeight: "bold",
                    color: "aqua",
                  }}
                >
                  {userData?.point}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
        <View style={{ marginTop: 20 }}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.floor(
                event.nativeEvent.contentOffset.x /
                  event.nativeEvent.layoutMeasurement.width
              );
              setBannerIndex(newIndex);
            }}
          >
            {userData?.banner.map((bannerUrl, index) => (
              <Image
                key={index}
                source={{ uri: bannerUrl }}
                style={styles.bannerImage}
              />
            ))}
          </ScrollView>
          <View style={styles.bannerIndicatorContainer}>
            {userData?.banner.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.bannerIndicator,
                  index === bannerIndex && styles.activeBannerIndicator,
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 14,
    backgroundColor: "white",
  },
  image: {
    backgroundColor: "white",
    width: "40%",
    height: undefined,
    aspectRatio: 2,
  },
  Card: {
    backgroundColor: "white",
    elevation: 5,
    padding: 10,
    borderRadius: 10,
  },
  bannerImage: {
    width: 320,
    height: 200,
    borderRadius: 10,
    marginRight: 10,
  },
  bannerIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  bannerIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeBannerIndicator: {
    backgroundColor: "aqua",
  },
});
