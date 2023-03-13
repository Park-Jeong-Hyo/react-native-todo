import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

// 컴포넌트 TextInput의 props인 placeholder에 값을 주기위함.
const StyledInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.main,
  //width를 이렇게 설정해서 양 옆에 공백을 40px씩 만들었다.
}))`
  width: ${({ width }) => width - 40}px;
  height: 60px;
  margin: 3px 0;
  padding: 15px 20px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.itemBackground};
  font-size: 20px;
  color: ${({ theme }) => theme.text};
`;

// input의 매개변수는 상위 components에서 온 props
const Input = ({
  // 아무것도 입력하지 않았을 때 뜨는 창
  placeholder,
  // 입력 값
  value,

  onChangeText,
  onSubmitEditing,
  onBlur,
}) => {
  // 휴대폰 마다 크기가 다르므로 고정값을 줄 경우 휴대폰마다 화면 출력이
  // 달라질 수 있다. 그러므로
  // 입력창의 크기를 어플리케이션의 크기에 맞추는 정적 메서드 Dimension.get('window')를 사용.
  // get('screen')의 경우는 휴대폰 화면 크기에 맞춘다.
  const { width } = Dimensions.get('window');
  // 현재까지의 흐름: app.js(input)-> input.js(StyledInput)
  return (
    <StyledInput
      width={width}
      placeholder={placeholder}
      maxLenth={50}
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="done"
      // secureTextEntry={true} 입력문자 보호
      // multiline={true}  여러줄입력
      onChangeText={onChangeText}
      value={value}
      onSubmitEditing={onSubmitEditing}
      onBlur={onBlur}
    />
  );
};

//prototype를 설정해서 어떤 종류의 타입이 와야하는 지 설정
//isrequired가 붙어 있으면 필수라는 뜻
Input.prototype = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default Input;
