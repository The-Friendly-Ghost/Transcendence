export class insertUserDto {
  intraId: number;
  name: string;
  image_url: string;
}

export class updateUsernameDto {
  intraId: number;
  name: string;
}

export class findUserDto {
  intraId: number;
}

export class addFriendDto {
  intraId: number;
  intraIdFriend: number;
}
