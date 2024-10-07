import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Note {
  'id' : string,
  'content' : string,
  'isCompleted' : boolean,
  'date' : bigint,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export interface _SERVICE {
  'addNote' : ActorMethod<[bigint, string], string>,
  'getDateTime' : ActorMethod<[string], string>,
  'getNotes' : ActorMethod<[], Array<Note>>,
  'getWeatherForecast' : ActorMethod<[string], string>,
  'updateNoteStatus' : ActorMethod<[string, boolean], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
