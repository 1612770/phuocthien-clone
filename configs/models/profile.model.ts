type ProfileModel = Partial<{
  id: string;
  phoneNumber: string;
  displayName: string;
  sex: string;
  birthday: string;
  tel: string;
  email: string;
  address: string;
  company: string;
  points: number;
  usedPoints: number;
  activePoint: number;
  isNew: boolean;
  lastLogin: string;
  imgUrl: string;
  isAllowLogin: boolean;
  createdTime: string;
}>;

export default ProfileModel;
