import { User } from "lucide-react";
import { getInitials } from "@/utils/avatar";

interface Props {
  name?: string;
  image?: string | null;
  size?: number;
}

const ProfileAvatar = ({ name, image, size = 36 }: Props) => {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full flex items-center justify-center
                 bg-gradient-to-br from-indigo-500 to-pink-500
                 text-white font-semibold select-none overflow-hidden"
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : name ? (
        <span className="text-sm">{getInitials(name)}</span>
      ) : (
        <User className="w-4 h-4" />
      )}
    </div>
  );
};

export default ProfileAvatar;
