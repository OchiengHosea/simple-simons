import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useEffect, useState} from "react";

export default function App() {
  const [flashLights, setFlashLights] = useState([0,1,2,3]);
  const [gameStatus, setGameStatus] = useState("Waiting");
  const [dialedLights, setDialedLights] = useState([]);
  const [colorLights, setColorLights] = useState(["red", "blue", "green", "yellow"]);
  const [selectedLights, setSelectedLights] = useState([]);
  // for stage n, app does n flashes, and user should win n flashes in a row
  const [stage, setStage] = useState({index:1,flashes:3});
  const [flashes, setFlashes] = useState([]);

  const [scoreRecord, setScoreRecord] = useState([]); // index: {flashes}, {answer}, {score}


  function getRandomLight() {
    return colorLights[Math.floor((Math.random()*colorLights.length))];
  }

  function getRandomDial() {
    return flashLights[Math.floor((Math.random()*flashLights.length))];
  }

  const levelUp = () => {
    // record win
    setDialedLights([]);
    setStage({index:stage.index+1, flashes: stage.flashes+1});
  }

  const restart = () => {
    setGameStatus("Playing");
    setDialedLights([]);
    setStage({index:1, flashes: 3});
  }

  // @ts-ignore
  const lightPressed = (light) => {
    // @ts-ignore
    setDialedLights([...dialedLights, light]);
    // setStage({index:1, flashes: 3});
    // console.log(dialedLights);
  }

  // @ts-ignore
  const AppButton = ({ onPress, title }) => (
      <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
        <Text style={styles.appButtonText}>{title}</Text>
      </TouchableOpacity>
  );

  // @ts-ignore
  const Light = ({onPress, index}) => (
    <TouchableOpacity onPress={onPress} style={
      {
        backgroundColor: selectedLights[index],
        height: 100,
        width: 100,
        borderRadius: 100,
        margin: 10,
        opacity: .5
      }
    } />
  );

  // @ts-ignore
  const computeScore = (dialedLights) => {
    for (let ind = 0; ind <= dialedLights.length; ind++){
      if (flashes[ind] != dialedLights[ind]) {
        console.log("You loose!");
        console.log("Dialed: ", dialedLights, "Flashes: ", flashes);
        restart();
        return;
      }
    }
    console.log("You win");
    console.log("Dialed: ", dialedLights, "Flashes: ", flashes);

    levelUp();
  }

  const shuffleColors = (llgts:any) => {
    while (llgts.length < colorLights.length){
      const clr = getRandomLight();
      // @ts-ignore
      if (!llgts.includes(clr)) llgts.push(clr);
    }
    // @ts-ignore
    setSelectedLights(llgts);
  }

  const flash = () => {
    const flashesTmp = [];
    for (let index = 0; index <= stage.flashes-1; index++){
      flashesTmp.push(getRandomDial());
    }
    // @ts-ignore
    setFlashes(flashesTmp);

    // set opacities to .9
    console.log("Expected: ", flashesTmp);

  }

  useEffect(() => {
    // if dials are finished, record loose or win
    if (dialedLights.length >= stage.flashes){
      // compute score
      computeScore(dialedLights);
    }

    if (dialedLights.length == 0) {
      // restart
      shuffleColors([]);
      flash();
    }
  }, [dialedLights]);

  useEffect(() => {
    const llgts:any = [];
    if (colorLights) {
      shuffleColors(llgts);
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={{fontWeight:"bold", fontSize: 20}}>Game of Simons</Text>

      <View style={styles.lightsContainer}>
        {selectedLights.length > 0 ? flashLights.map((l,i) => <Light key={i} index={i} onPress={() => lightPressed(l)}/>) : null}
      </View>

      <View style={{marginTop: 50}}>
        <AppButton onPress={restart} title={"Start"}/>
      </View>

    </View>
  );
}

// start with 3 combinations
// increment as user passes

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  startButton: {
    padding: 10,

  },

  lightsContainer: {
    flex: .5,
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 50
  },

  light:{
    backgroundColor: "#c6c2c2",
    height: 100,
    width: 100,
    borderRadius: 100,
    margin: 10,
  },

  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12
  },

  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  }
});
