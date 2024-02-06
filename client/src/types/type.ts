export interface ListingType {
  _id: string;
  imageUrls: string[];
  name: string;
  description: string;
  address: string;
  regularPrice: number;
  discountPrice: number;
  bathrooms: number;
  bedrooms: number;
  furnished: boolean;
  parking: boolean;
  type: string;
  offer: boolean;
  userRef: string;
  createdAt: number;
  updatedAt: number;
  __v: number;
}
export interface FormData {
  profilePicture?: string;
}
