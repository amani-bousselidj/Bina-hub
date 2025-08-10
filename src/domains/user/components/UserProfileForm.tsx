import React from 'react';

interface UserProfileFormProps {
  user?: any;
  onProfileUpdate?: (profile: any) => void;
  className?: string;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ 
  user,
  onProfileUpdate, 
  className = '' 
}) => {
  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4">نموذج الملف الشخصي</h3>
      <p className="text-gray-600">نموذج الملف الشخصي قيد التطوير</p>
    </div>
  );
};

export default UserProfileForm;



