export class setUsernameDto {
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
