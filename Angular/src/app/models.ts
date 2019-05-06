export interface UserResponse{
  meta: {},
  objects: User[]
}
export interface GameResponse{
  meta: {},
  objects: Game[]
}

export interface Game{
  player_one:string,
  player_two:string,
  line_owner: any,
  resource_uri: string,
  current_player:string,
  player_one_lines: any,
  player_two_lines:any ,
}

export interface User{
email: string,
id: number,
password: string,
resource_uri: string,
username: string,
lfg: number
}
