import { Pressable, ViewStyle } from 'react-native';
import { StyleProp } from 'react-native';
import { StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface PressableIconProps {
  type: 'edit' | 'delete-outline' | 'check' | 'close' | 'arrow-back';
  onPress: () => void;
  color: string;
  hitSlop: number;
  iconSize: number;
  containerStyle?: StyleProp<ViewStyle>;
}

const PressableIcon = ({
  type,
  onPress,
  color,
  hitSlop,
  containerStyle,
  iconSize,
}: PressableIconProps) => {
  return (
    <Pressable style={[containerStyle, styles]} onPress={onPress} hitSlop={hitSlop}>
      <MaterialIcons name={type} size={iconSize} color={color} />
    </Pressable>
  );
};

const styles = StyleSheet.create({});

export default PressableIcon;
