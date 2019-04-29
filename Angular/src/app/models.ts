export interface UserResponse{
  meta: {},
  objects: User[]
}
export interface Game{
  player_one:string,
  player_two:string,
  line_owner:string,
  resource_uri: string,
  current_player:string,
  player_one_lines:string,
  player_two_lines:string,
}

export interface User{
email: string,
id: number,
password: string,
resource_uri: string,
username: string,
lfg: number
}