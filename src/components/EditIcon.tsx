import { Pressable, ViewStyle } from 'react-native';
import { StyleProp } from 'react-native';
import { StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface EditButtonProps {
  onPress: () => void;
  color: string;
  hitSlop: number;
  iconSize: number;
  containerStyle?: StyleProp<ViewStyle>;
}

const EditButton = ({ onPress, color, hitSlop, containerStyle, iconSize }: EditButtonProps) => {
  return (
    <Pressable style={[containerStyle, styles]} onPress={onPress} hitSlop={hitSlop}>
      <MaterialIcons name="edit" size={iconSize} color={color} />
    </Pressable>
  );
};

const styles = StyleSheet.create({});

export default EditButton;
