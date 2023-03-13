import React, { useCallback, useState, useEffect } from 'react';
import theme from './theme';
import styled, { ThemeProvider } from 'styled-components/native';
import { StatusBar, Dimensions } from 'react-native';
import Input from './components/input';
import { images } from './images';
import IconButton from './components/IconButton';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

// flex:1 flex-grow: 1(비율), flex-shrink: 1(flex-basis보다 작아질 수 있다), flex-basis:0(설정한 값보다 작아질 수 없다.)
// SafeAreaView: 아이폰 노치부분을 제외하고 화면 비율에 맞게 조정해줌
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.background}
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.Text`
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.main}
  align-self: flex-start;
  margin: 0px 20px;
`;

const List = styled.ScrollView`
  flex: 1;
  width: ${({ width }) => width - 40}px;
`;

// keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const App = () => {
  const width = Dimensions.get('window').width;
  const [isReady, setIsReady] = useState(false);
  // state를 사용해서 값을 조정하고자 한다.
  // userstate는 기본값을 지정해주어야 한다.
  // newTask와 setNewTask를 만든 이유는 값의 초기화를 위해
  // tasks, setTasks를 통해서 task의 값을 수정하고자 함.
  // task에 직접 값을 대입할 수는 없다. 그래서 setTasks를 통해 값을 대입
  // useState 함수 내부에는 배열 new어쩌구, set어쩌구가 있는 형태
  // function userState() {[const new어쩌구 => {...어쩌구}], [const set어쩌구 = () => {...어쩌구}]}
  const [newTask, setNewTask] = useState('');
  // task의 기본값을 설정
  const [tasks, setTasks] = useState({
    // 1: { id: '1', text: 'hanbit', completed: false },
    // 2: { id: '2', text: 'React Native', completed: true },
    // 3: { id: '3', text: 'React Native Sample', completed: false },
    // 4: { id: '4', text: 'Edit TODO Item', completed: false },
  });

  //aysnc는 비동기화 객체인 프로미스를 동기화 처럼 작동하게 하는 것, 함수 앞에 붙는다.
  //await은 async가 붙어 있어야만 사용이 가능하다. 프로미스가 처리될 때 까지 기다리는 역핧을 한다.
  const _saveTasks = async tasks => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      setTasks(tasks);
    } catch (e) {
      console.error(e);
    }
  };

  const _loadTasks = async () => {
    const loadedTasks = await AsyncStorage.getItem('tasks');
    setTasks(JSON.parse(loadedTasks || '{}'));
  };

  useEffect(() => {
    async function prepare() {
      try {
        await _loadTasks();
      } catch (e) {
        console.error(e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  const _addTask = () => {
    // 리액트에서 컴포넌트 배열을 렌더링 했을 때 어떤 아이템이 추가, 수정, 삭제 되었는지
    // 식별하는 것을 돕는 고유 값으로 리엑트에서 특별하게 관리되며 자식 컴포넌트의 props로 전달
    // 되지 않는 KEY를 만들기 위해서 지정
    // Date.now()는 1970년 1월 1일 이후에 몇 밀리초가 지났는 지를 센다.
    // Date객체의 시간 값을 string으로 반환/ Date.prototype.toString()
    const ID = Date.now().toString();
    // 입력할 값, id로 keyt를 만들기 위해서 지정, complete는
    const newTaskObject = {
      [ID]: { id: ID, text: newTask, completed: false },
    };
    // 작성 완료시 나타나는 알림
    alert(`Add: ${newTask}`);
    // 입력 창을 빈창으로 만듦
    setNewTask('');
    // 태스크에 기존값(...task)과 입력값(newTaskObject)를 넣음
    _saveTasks({ ...tasks, ...newTaskObject });
  };
  const _deleteTask = id => {
    // task의 내용으 그대로 가져와서 새로운 객체 생성
    const currentTasks = Object.assign({}, tasks);
    // 매개변수 id값을 받아서 삭제
    delete currentTasks[id];
    // 서버에 저장
    _saveTasks(currentTasks);
  };
  const _toggleTask = id => {
    const currentTasks = Object.assign({}, tasks);
    //completed 상태를 계속 반전시킨다.
    currentTasks[id]['completed'] = !currentTasks[id]['completed'];
    _saveTasks(currentTasks);
  };
  // item을 인수로 해서
  const _updateTask = item => {
    //우선 새로운 객체에 기존 객체를 복사
    const currentTasks = Object.assign({}, tasks);
    // item을 새로운 객체.id에 대입한다.
    currentTasks[item.id] = item;
    _saveTasks(currentTasks);
  };
  const _handleTextChange = text => {
    setNewTask(text);
    console.log(`변경된문자열:${newTask}`);
  };
  const _onBlur = () => {
    setNewTask('');
  };
  return (
    // context api, theme라는 prop을 가지고 있고
    // prop의 값으로는 import 한 theme.js를 사용
    // 최상위 components에서 props를 하위 components에 전달
    <ThemeProvider theme={theme}>
      <Container onLayout={onLayoutRootView}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.background}
        />
        <Title>TODO List</Title>
        <Input
          /*입력창은 빈 칸으로 두기*/
          value={newTask}
          placeholder="+ Add a Task"
          /*input core component의 props*/
          onChangeText={_handleTextChange}
          onSubmitEditing={_addTask}
          onBlur={_onBlur}
        />
        <List width={width}>
          {Object.values(tasks)
            .reverse()
            .map(item => (
              <Task
              //하위 프로퍼티로 전달

                key={item.id}
                text={item.text}
                item={item}
                deleteTask={_deleteTask}
                toggleTask={_toggleTask}
                updateTask={_updateTask}
              />
            ))}
        </List>
      </Container>
    </ThemeProvider>
  );
};

export default App;
