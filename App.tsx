import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useEffect, useState} from "react";

export default function App() {
  const [flashLights, setFlashLights] = useState([0,1,2,3]);
  const [gameStatus, setGameStatus] = useState("");
  const [dialedLights, setDialedLights] = useState([]);
  const [colorLights, setColorLights] = useState(["red", "blue", "green", "brown"]);
  const [selectedLights, setSelectedLights] = useState([]);
  // for stage n, app does n flashes, and user should win n flashes in a row
  const [stage, setStage] = useState({index:1,flashes:3});
  const [flashes, setFlashes] = useState([]);
  const [blinkingIndex, setBlinkingIndex] = useState(-1);

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
    setFlashes([]);
    setStage({index:1, flashes: 3});
  }

  // @ts-ignore
  const lightPressed = (light) => {
    // @ts-ignore
    setDialedLights([...dialedLights, light]);
  }

  // @ts-ignore
  const AppButton = ({ onPress, title }) => (
      <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
        <Text style={styles.appButtonText}>{title}</Text>
      </TouchableOpacity>
  );

  // @ts-ignore
  const Light = ({onPress, index}) => (
    <TouchableOpacity onPress={onPress} style={[{
      ...styles.light,
      backgroundColor: selectedLights[index]},
        index===blinkingIndex ? styles.blinked : styles.stayed]
      } />
  );

  // @ts-ignore
  const computeScore = (dialedLights) => {
    let dialMatched = true;
    for (let ind = 0; ind <= dialedLights.length; ind++){
      if (flashes[ind] != dialedLights[ind]) {
        dialMatched = false;
        setGameStatus("You Lose!");
        setTimeout(() => {
          restart();
          return;
        }, 3000);
      }
    }

    if (dialMatched && stage.index == 5){
      setGameStatus("You Win!");
      setTimeout(() => {
        restart();
        return
      }, 2000)
    } else if (dialMatched) {
      levelUp();
    }

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

  // @ts-ignore
  async function blink(ll) {
    for(let i = 0; i <= ll.length -1; i++){
      setBlinkingIndex(ll[i]);
      await sleep(1000);
    }
    setBlinkingIndex(-1);
  }

  const sleep = (m: number) => new Promise((r) => setTimeout(r, m));

  const flash = () => {
    const flashesTmp = [];
    for (let index = 0; index <= stage.flashes-1; index++){
      flashesTmp.push(getRandomDial());
    }
    // @ts-ignore
    setFlashes(flashesTmp);

    blink(flashesTmp);

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

      <Text>Wind 5 in row</Text>

      <Text>{gameStatus}</Text>

      <Text>Level : {stage.index},  {stage.flashes} clicks</Text>
      <View style={styles.lightsContainer}>
        {selectedLights.length > 0 ? flashLights.map((l,i) => <Light key={i} index={i} onPress={() => lightPressed(l)}/>) : null}
      </View>

      <View style={{marginTop: 50}}>
        <AppButton onPress={restart} title={gameStatus === "" ? "Start" : "Restart"}/>
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

  blinked: {
    opacity: .8,
    elevation: 8,
  },

  stayed: {
    opacity: .5,
    elevation: 0
  },

  lightsContainer: {
    flex: .5,
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 50
  },

  light:{
    height: 100,
    width: 100,
    borderRadius: 100,
    margin: 10,
    opacity: .5
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
