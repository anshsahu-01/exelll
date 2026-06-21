import { ActivityIndicator, Pressable, Text, View, ViewStyle } from "react-native";
import { cn } from "@/utils/cn";

type ButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  textClassName?: string;
  style?: ViewStyle;
  icon?: React.ReactNode;
};

export function Button({
  title,
  onPress,
  loading,
  disabled,
  variant = "primary",
  className,
  textClassName,
  style,
  icon,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={style}
      className={cn(
        "h-11 flex-row items-center justify-center rounded-md px-4",
        variant === "primary" && !isDisabled && "bg-ink",
        variant === "secondary" && !isDisabled && "bg-canvas",
        variant === "outline" && !isDisabled && "border border-line bg-white",
        isDisabled && "bg-[#F0F0F0] border border-[#E0E0E0] opacity-80",
        className
      )}
    >
      {loading ? (
        <ActivityIndicator color={isDisabled ? "#A0A0A0" : (variant === "outline" ? "#1A1A1A" : "#FFFFFF")} />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          <Text
            className={cn(
              "text-[15px] font-semibold",
              variant === "primary" && !isDisabled && "text-white",
              variant !== "primary" && !isDisabled && "text-ink",
              isDisabled && "text-[#A0A0A0]",
              textClassName
            )}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}
