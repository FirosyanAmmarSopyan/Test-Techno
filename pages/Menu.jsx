import React, { useEffect, useState } from "react";
import {
  // ... (imports lainnya)
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { TabView, SceneMap } from "react-native-tab-view";

const encodePhotoUri = (photo) => {
  return encodeURIComponent(photo);
};

export default function MenuScreen() {
  const layout = useWindowDimensions();
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const [index, setIndex] = React.useState(0);
  const [routes, setRoutes] = React.useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");

        const response = await axios.post(
          "https://soal.staging.id/api/menu",
          { show_all: 1 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data.result;

        const menuCategories = data.categories;
        console.log(
          response.data.result.categories[1].menu[1].photo,
          "<><><><><><><>"
        );
        console.log(
          "Image URL:",
          encodePhotoUri(response.data.result.categories[1].menu[1].photo)
        );

        setCategories(menuCategories);

        const menuRoutes = menuCategories.map((category) => ({
          key: category.category_name.toLowerCase().replace(/\s/g, ""),
          title: category.category_name,
          category: category,
        }));

        setRoutes(menuRoutes);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const renderScene = SceneMap(
    Object.fromEntries(
      routes.map((route) => [
        route.key,
        () => (
          <ScrollView style={{ marginTop: 15 }}>
            {route.category.menu.map((menuItem, index) => (
              <View key={index} style={styles.menuItemContainer}>
                <View>
                  <Image
                    source={{ uri: encodePhotoUri(menuItem?.photo) }}
                    style={styles.menuItemImage}
                  />
                </View>
                <View>
                  <Text style={styles.menuItemTitle}>{menuItem.name}</Text>
                  <Text style={styles.menuItemDescription}>
                    {menuItem.description}
                  </Text>
                </View>
                <View>
                  <Text style={styles.menuItemPrice}>{menuItem.price}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        ),
      ])
    )
  );

  return (
    <>
      <View style={styles.AndroidSafeArea}>
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              alignSelf: "center",
              marginVertical: 10,
            }}
          >
            MENU
          </Text>
        </View>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
    width: 200,
    height: 100,
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
  menuItemContainer: {
    flexDirection: "row",
    marginVertical: 5,
    justifyContent: "space-between",
    maxWidth: "70%",
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  menuItemDescription: {
    color: "grey",
    maxWidth: "90%",
  },
  menuItemPrice: {
    fontWeight: "500",
    fontSize: 16,
  },
});
