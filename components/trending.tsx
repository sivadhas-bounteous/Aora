import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import React, { FC, useState } from "react";
import * as Animatable from "react-native-animatable";
import { icons } from "@/constants";

import { Video, ResizeMode } from "expo-av";

type videoType = {
      key:string,
      $id:string,
      title:string,
      thumbnail:string,
      video:string,
      creator:{
          username:string,
          avatar:string,
      }
  }

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1.1,
  },
};
const zoomOut = {
  0: {
    scale: 1.1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item }: {activeItem:string, item:videoType}) => {
  const [playing, setPlaying] = useState(false);
  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {playing ? (
        <Video
          source={{ uri: item.video }}
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status)=> {
            if(status.isLoaded && status.didJustFinish) setPlaying(false)
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlaying(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/400"
          ></ImageBackground>

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          ></Image>
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

type TrendingProps = {
  posts: any[];
};
const Trending: FC<TrendingProps> = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]);

  function viewableItemsChanged({ viewableItems }: {viewableItems:{key:string}[]} ) {
    if (viewableItems.length > 0) setActiveItem(viewableItems[0].key);
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item}></TrendingItem>
      )}
      horizontal
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170 }}
    ></FlatList>
  );
};

export default Trending;
