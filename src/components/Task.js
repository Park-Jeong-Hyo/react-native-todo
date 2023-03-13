import React, { useState } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import IconButton from './IconButton';
import { images } from '../images';
import Input from './input';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.itemBackground};
  border-radius: 10px;
  padding: 5px;
  margin: 3px 0px;
`;

const Contents = styled.Text`
  flex: 1;
  font-size: 24px;
  color: ${({ theme, completed }) => (completed ? theme.done : theme.text)};
  text-decoration-line: ${({ completed }) =>
    completed ? 'line-through' : 'none'};
`;

// 상위 컴포넌트에서 전달된 프로퍼티, 정의는 상위 컴포넌트에 되어 있고
// 하위 컴포넌트는 그것을 받아서 쓰기만 한다.
const Task = ({ item, deleteTask, toggleTask, updateTask }) => {
  // 수정모드인지 아닌지 확인
  const [isEditing, setIsEditing] = useState(false);
  // task의 글자를 설정하는 state
  const [text, setText] = useState(item.text);
  //onPressOut을 통해서 수정모드 작동 여부를 정하는 함수
  const _handleUpdateButtonPress = () => {
    setIsEditing(true);
  };
  // textinput의 submit버튼이 눌러졌을 때 작동하는 함수
  const _onsubmitEditing = () => {
    //만약 수정모드면
    if (isEditing) {
      //기존 객체를 복사한 새로운 객체를 만들고
      //여기서 의문인 점은 왜 item을 가져왔냐 하는 점?
      //의문이 해결되지 않음.
      const editedTask = Object.assign({}, item, { text });
      // 수정모드를 비활성화 한 다음에
      setIsEditing(false);
      //상위 객체에서 받아 온 프로퍼티에 새로운 객체를 집어 넣는다.
      updateTask(editedTask);
      // 이렇게 하면 수정 완료
    }
  };
  const _onBlur = () => {
    if (isEditing) {
      setIsEditing(false);
      setText(item.text);
    }
  };
  return isEditing ? (
    <Input
      value={text}
      onChangeText={text => setText(text)}
      onSubmitEditing={_onsubmitEditing}
      onBlur={_onBlur}
    />
  ) : (
    <Container>
      <IconButton
        type={item.completed ? images.completed : images.uncompleted}
        id={item.id}
        onPressOut={toggleTask}
        completed={item.completed}
      />
      <Contents completed={item.completed}>{item.text}</Contents>
      {item.completed || (
        <IconButton
          type={images.update}
          //textinput의 프로퍼티 onPressOut
          onPressOut={_handleUpdateButtonPress}
        />
      )}
      <IconButton
        type={images.delete}
        id={item.id}
        onPressOut={deleteTask}
        completed={item.completed}
      />
    </Container>
  );
};

Task.propTypes = {
  text: PropTypes.string.isRequired,
  deleteTask: PropTypes.func.isRequired,
  toggleTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
};

export default Task;
