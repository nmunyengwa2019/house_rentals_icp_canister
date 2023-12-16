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
    blob
  } from "azle";

  import { v4 as uuidv4 } from "uuid";


  
  const User = Record({
    id:text,
    name:text,
    houses:nat64,
    contact:text,
    verified:bool
  });

  const UserPayload = Record({
    name:text,
    houses:nat64,
    contact:text,
    verified:bool
  });
  
  const House = Record({
    id: text,
    owner_id:text,
    image:blob,
    isBooked:bool,
    rooms:nat64,
    bathrooms:nat64,
    ensuit:bool,
    address:text,
    rating:text
  });

  const HousePayload = Record({
    owner_id:text,
    
    image:blob,
    isBooked:bool,
    rooms:nat64,
    bathrooms:nat64,
    ensuit:bool,
    address:text,
  });

  const numOfroomsPayload = Record({
    minimumRooms:nat64,
    maximumRooms:nat64
  });



  type User = typeof User;
  type House = typeof House;
  type HousePayload = typeof HousePayload;
  type UserPayload = typeof UserPayload;

  let userStorage = StableBTreeMap<text,User>(text,User,0);
  let houseStorage = StableBTreeMap<text,House>(text,House,0);


  
  
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
  
  //let messageStorage = StableBTreeMap<text, Message>(text, Message, 0);
  
  export default Canister({

    addHouse: update([HousePayload],House,(payload)=>{
      const house: House={
        id: uuidv4(),
        ...payload,
        rating:"*"
      }
      houseStorage.insert(house.id,house);
      return house;
    }),
    
    getHouse: query([text],Opt(House),(id)=>{
      return houseStorage.get(id);
    }),

    getHouses: query([],Vec(House),()=>{

      return houseStorage.values();
    }),

    getUnBookedHouses: query([],Vec(House),()=>{
      const allHouses: House[] = houseStorage.values();
      const unBookedHouses: House[] = [];
      for (const house of allHouses) {
        if (house.isBooked === false) {
          unBookedHouses.push(house);
        }
      }
      return unBookedHouses;
    }),

    getBookedHouses: query([],Vec(House),()=>{
      const allHouses: House[] = houseStorage.values();
      const bookedHouses: House[] = [];
      for (const house of allHouses) {
        if (house.isBooked === true) {
          bookedHouses.push(house);
        }
      }
      return bookedHouses;
    }),

    filterByRooms:query([nat64,nat64],Vec(House),(minimumRooms,
      maximumRooms)=>{
      const allHouses: House[] = houseStorage.values();
      const bookedHouses: House[] = [];
      for (const house of allHouses) {
        if (house.isBooked === true && house.rooms>=minimumRooms && house.rooms<=maximumRooms) {
          bookedHouses.push(house);
        }
      }

      return bookedHouses;

    }),


  
    deleteHouse: update([text], Opt(House), (id) => {
      return houseStorage.remove(id);
    }),
  });
  
  // a workaround to make uuid package work with Azle
  globalThis.crypto = {
    // @ts-ignore
   getRandomValues: () => {
       let array = new Uint8Array(32)
  
       for (let i = 0; i < array.length; i++) {
           array[i] = Math.floor(Math.random() * 256)
       }
  
       return array
   }
  }