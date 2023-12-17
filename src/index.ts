import {
  query,
  update,
  Record,
  StableBTreeMap,
  Vec,
  nat64,
  Opt,
  text,
  Canister,
  bool,
  blob,
} from "azle";

import { v4 as uuidv4 } from "uuid";

const User = Record({
  id: text,
  name: text,
  houses: nat64,
  contact: text,
  verified: bool,
});

const UserPayload = Record({
  name: text,
  houses: nat64,
  contact: text,
  verified: bool,
});

const House = Record({
  id: text,
  owner_id: text,
  image: blob,
  isBooked: bool,
  rooms: nat64,
  bathrooms: nat64,
  ensuit: bool,
  address: text,
  rating: text,
});

const HousePayload = Record({
  owner_id: text,
  image: blob,
  isBooked: bool,
  rooms: nat64,
  bathrooms: nat64,
  ensuit: bool,
  address: text,
});

const numOfroomsPayload = Record({
  minimumRooms: nat64,
  maximumRooms: nat64,
});

type User = typeof User;
type House = typeof House;
type HousePayload = typeof HousePayload;
type UserPayload = typeof UserPayload;

let userStorage = StableBTreeMap<text, User>(text, User, 0);
let houseStorage = StableBTreeMap<text, House>(text, House, 0);

const Message = Record({
  id: text,
  title: text,
  body: text,
  attachmentURL: text,
  createdAt: nat64,
  updatedAt: Opt(nat64),
});

type Message = typeof Message;

const MessagePayload = Record({
  title: text,
  body: text,
  attachmentURL: text,
});

type MessagePayload = typeof MessagePayload;

export default Canister({
  addHouse: update([HousePayload], House, (payload) => {
    const house: House = {
      id: uuidv4(),
      ...payload,
      rating: "*",
    };
    houseStorage.insert(house.id, house);
    return house;
  }),

  getHouse: query([text], Opt(House), (id) => {
    return houseStorage.get(id);
  }),

  getHouses: query([], Vec(House), () => {
    return houseStorage.values();
  }),

  getUnBookedHouses: query([], Vec(House), () => {
    return filterHousesByBookingStatus(false);
  }),

  getBookedHouses: query([], Vec(House), () => {
    return filterHousesByBookingStatus(true);
  }),

  filterByRooms: query([nat64, nat64], Vec(House), (minimumRooms, maximumRooms) => {
    return filterHousesByBookingStatusAndRooms(true, minimumRooms, maximumRooms);
  }),

  deleteHouse: update([text], Opt(House), (id) => {
    return houseStorage.remove(id);
  }),
});

function filterHousesByBookingStatus(isBooked: boolean): House[] {
  const allHouses: House[] = houseStorage.values();
  return allHouses.filter((house) => house.isBooked === isBooked);
}

function filterHousesByBookingStatusAndRooms(
  isBooked: boolean,
  minimumRooms: nat64,
  maximumRooms: nat64
): House[] {
  return filterHousesByBookingStatus(isBooked).filter(
    (house) => house.rooms >= minimumRooms && house.rooms <= maximumRooms
  );
}

