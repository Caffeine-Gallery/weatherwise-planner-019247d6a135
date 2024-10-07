export const idlFactory = ({ IDL }) => {
  const Note = IDL.Record({
    'id' : IDL.Text,
    'content' : IDL.Text,
    'isCompleted' : IDL.Bool,
    'date' : IDL.Int,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'addNote' : IDL.Func([IDL.Int, IDL.Text], [IDL.Text], []),
    'getDateTime' : IDL.Func([IDL.Text], [IDL.Text], []),
    'getNotes' : IDL.Func([], [IDL.Vec(Note)], ['query']),
    'getWeatherForecast' : IDL.Func([IDL.Text], [IDL.Text], []),
    'updateNoteStatus' : IDL.Func([IDL.Text, IDL.Bool], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
