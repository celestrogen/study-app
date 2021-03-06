import { createContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TodoList from '/components/TodoList';
import Controls from '/components/Controls';
import Background from '../components/Background';
import CurrentlyPlaying from '../components/CurrentlyPlaying';
import BottomControls from '../components/BottomControls';
import Pomodoro from '../components/Pomodoro';
import { readdirSync } from "fs";
import useElemState from '../hooks/useElemState';
import Links from '../components/Links';
const path = require("path")


const stations = ['https://www.youtube.com/watch?v=-5KAN9_CzSA',
  'https://www.youtube.com/watch?v=-9gEgshJUuY',
  'https://www.youtube.com/watch?v=jfKfPfyJRdk',
  'https://www.youtube.com/watch?v=kgx4WGK0oNU',
  'https://www.youtube.com/watch?v=ceqgwo7U28Y']


export function getStaticProps(context)
{

  const backgroundsDirectory = path.resolve(process.cwd(), 'public/mp4/backgrounds');
  let backgrounds = readdirSync(backgroundsDirectory)
  backgrounds = backgrounds.map(filename => `mp4/backgrounds/${filename}`)


  const controlState = {
    stations: stations,
    paused: false,
    backgrounds: backgrounds,
    backgroundIndex: 4,
    background: backgrounds[4], //handled by useEffect
    transitionPlaying: false,
    todo: {
      enabled: false
    },
    timer: {
      focusTime: 25 * 60,
      breakTime: 5 * 60,
      playSound: true,
      enabled: false
    },
    rain: {
      enabled: false, volume: 50,
      imgSrc: '/img/rain.svg',
      mediaSrc: '/mp3/rain.mp3'
    },
    fire: {
      enabled: false, volume: 50,
      imgSrc: '/img/fire.svg',
      mediaSrc: '/mp3/fire.mp3'
    },
    nature: {
      enabled: false, volume: 50,
      imgSrc: '/img/nature.svg',
      mediaSrc: '/mp3/nature.mp3'
    },
    whitenoise: {
      enabled: false, volume: 50,
      imgSrc: '/img/sounds.svg',
      mediaSrc: '/mp3/brown_noise.mp3'
    },
    music: {
      enabled: false, volume: 50,
      imgSrc: '/img/music-note.svg',
      stationIndex: 2,
      mediaSrc: '' //handled by useEffect
    },
  }

  return {
    props: { defaultControlState: controlState },
  }
}



export const controlStateContext = createContext();

export default function App({ defaultControlState }) {
  const [controlState, setControlState] = useState(defaultControlState);


  useEffect(() => {
    //todo niet beste manier om dit te doen
    setControlState(oldState => {
      const newState = { ...oldState }
      newState.background = controlState.backgrounds[controlState.backgroundIndex]
      return newState
    })
  }, [controlState.backgroundIndex])

  useEffect(() => {
    //todo niet beste manier om dit te doen
    setControlState(oldState => {
      const newState = { ...oldState }
      newState.music.mediaSrc = stations[controlState.music.stationIndex]
      return newState
    })
  }, [controlState.music.stationIndex])

  return (
    <>
      <controlStateContext.Provider value={[controlState, setControlState]}>
        <Background background={controlState.background} />
        <div className="print-clearly text-white static z-10">
          <div className='relative flex h-screen'>
              <div className='absolute right-0 left-0 top-0 bottom-0 m-auto w-min h-min text-center gap-14 flex flex-col md:flex-row'>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ default: {ease: "easeInOut"}, duration: 0.4 }}>
                  <TodoList visible={controlState.todo.enabled} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ default: {ease: "easeInOut"}, duration: 0.4 }}>
                  <Pomodoro />
                </motion.div>
              </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className='flex ml-auto items-center'>
              <Controls />
            </motion.div>
            <div className="absolute bottom-0 left-0 ml-2 mb-2">
              <CurrentlyPlaying />
            </div>

            

            <motion.div
              initial={{ opacity: 0 , y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute top-0 left-0 ml-2 mt-2">
              <Links />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute bottom-0 right-0 mr-2 mb-2">
              <BottomControls />
            </motion.div>
          </div>
        </div>
      </controlStateContext.Provider>

    </>)
}