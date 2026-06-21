import { useState } from "react";
import { Text, TextInput, TextInputProps, View, Pressable } from "react-native";
import { cn } from "@/utils/cn";
import { Ionicons } from "@expo/vector-icons";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  inputClassName?: string;
};

export function Input({ label, error, className, inputClassName, secureTextEntry, ...props }: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = secureTextEntry !== undefined && secureTextEntry !== false;

  return (
    <View className={cn("mb-3", className)}>
      {label ? <Text className="mb-1 text-[13px] font-medium text-muted">{label}</Text> : null}
      <View className="relative">
        <TextInput
          placeholderTextColor="#999999"
          secureTextEntry={isPassword ? !isPasswordVisible : false}
          className={cn(
            "h-11 rounded-md border border-line bg-white px-3 text-[15px] text-ink",
            isPassword && "pr-10",
            error && "border-danger",
            inputClassName
          )}
          {...props}
        />
        {isPassword && (
          <Pressable
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute right-3 top-0 bottom-0 justify-center items-center"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={20}
              color="#999999"
            />
          </Pressable>
        )}
      </View>
      {error ? <Text className="mt-1 text-[13px] text-danger">{error}</Text> : null}
    </View>
  );
}
