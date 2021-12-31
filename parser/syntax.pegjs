///////////////////////////////////////////////////////////////////////////////////////////////////
//
// EntryPoint
//
//   Schema = TypeDef[]
//
///////////////////////////////////////////////////////////////////////////////////////////////////

start = l:(typedef / __ )*
{
  return l.filter((t: any) => t?.type !== 'whitespace')
}



///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Comments / Whitespaces
//
///////////////////////////////////////////////////////////////////////////////////////////////////

comment = "//" c:[^\r\n]*
{
  return {
    type: "comment",
    payload: { comment: "//" + c.join('') },
    location: location()
  }
}


_  = ([ \r\n\t] / comment)* { return { type: "whitespace" } }
__ = ([ \r\n\t] / comment)+ { return { type: "whitespace" } }



///////////////////////////////////////////////////////////////////////////////////////////////////
//
// TypeDef
//
//   TypeDef = ("export") + "type" + Identifier + "=" + Type
//
///////////////////////////////////////////////////////////////////////////////////////////////////

typedef = e:"export"? _ "type" __ identifier:identifier _ "=" _ type:type _ ";"
{
  return {
    type: "typedef",
    payload: {
      modifiers: e ? [e] : [],
      identifier,
      type
    },
    location: location()
  }
}



///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Identifier
//
//   Identifier = /[a-zA-Z_][a-zA-Z0-9_]*/
//
///////////////////////////////////////////////////////////////////////////////////////////////////

identifier = i:([a-zA-Z_][a-zA-Z0-9_]*)
{
  return {
    type: "identifier",
    payload: {
      name: i[0] + i[1].join('')
    },
    location: location()
  }
}



///////////////////////////////////////////////////////////////////////////////////////////////////
//
// Type
//
//   Type = NonArrayType + (ArrayBracket)
//
//          NonArrayType = IntersectionType / UnionType
//
//                         IntersectionType = ("|")? + Type + ("|" + Type)*
//
//          ArrayBracket = / "[" + UnsignedInt + "]"
//                         / "[" + (UnsignedInt) + "," + (UnsignedInt) + "]"
//
///////////////////////////////////////////////////////////////////////////////////////////////////

type = underlying:(intersection_type / union_type) array:(_ "[" _ uint? _ "]" _ / _ "[" _ uint? _ "," _ uint? _ "]" _)*
{
  if (array.length === 0) return underlying;
  return array.reduce((carry: any, current: any) => {
    if (current.length === 7) {
      if (current[3] === null)
        return {
          type: 'array_type',
          payload: {
            type: carry,
            min: null,
            max: null
          },
          location: location()
        }
      return {
        type: 'array_type',
        payload: {
          type: carry,
          min: current[3],
          max: current[3]
        },
        location: location()
      }
    }
    if (current.length === 11) {
     return {
       type: 'array_type',
       payload: {
         type: carry,
         min: current[3],
         max: current[7]
       },
       location: location()
     }
    }
    return {
      type: 'error',
      location: location()
    }
  }, underlying);
}

uint = u:("0" / [1-9][0-9]*)
{
  return {
    type: "unsigned_integer",
    value: u === "0" ? "0" : u[0] + u[1].join(''),
    location: location()
  }
}
sint = u:([+-]?("0" / [1-9][0-9]*))
{
  return {
    type: "signed_integer",
    value: (u[0] === '-' ? '-' : '') + (u[1] === "0" ? 0 : u[1][0] + u[1][1].join('')),
    location: location()
  }
}
float = g:([+-]?([0-9]+([.][0-9]*)([eE][+-]?[0-9]+)?/[.][0-9]+([eE][+-]?[0-9]+)?))
{
  return {
    type: "float",
    value:
        (g[0] ?? '')
      + (g[1][0] === null ? "" : typeof (g[1][0]) === "string" ? g[1][0] : g[1][0].join(''))
      + (g[1][1] === null ? "" : typeof (g[1][1]) === "string" ? g[1][1] : Array.isArray(g[1][1][1]) ? (g[1][1][0] + g[1][1][1].join('')) : g[1][1].join(''))
      + (g[1][2] === null ? "" : 'e' + (g[1][2][1] ?? '') + g[1][2][2].join('')),
    location: location()
  }
}
boolean = f:("true" / "false")
{
  return {
    type: "boolean",
    value: f === "true",
    location: location()
  }
}
string = t:(('"' ([^\\"]/ "\\" .)* '"') / ("'" ([^\\']/ "\\" .)* "'"))
{
  return {
    type: "string",
    value: t[1].map((x: any) => Array.isArray(x) ? x.join('') : x).join(''),
    location: location()
  }
}

string_type_min_max = "string" _ "(" _ "{" _ min:uint _ "," _ max:uint _ "}" _ ")" { return { type: "string_type", payload: { min, max }, location: location() } }
string_type_max     = "string" _ "(" _ "{" _ "," _ max:uint _ "}" _ ")"            { return { type: "string_type", payload: { min: null, max }, location: location() } }
string_type_min     = "string" _ "(" _ "{" _ min:uint _ "," _ "}" _ ")"            { return { type: "string_type", payload: { min, max: null }, location: location() } }
string_type_fixed   = "string" _ "(" _ "{" _ len:uint _ "}" _ ")"                  { return { type: "string_type", payload: { min: len, max: len }, location: location() } }
string_type_default = "string"                                                     { return { type: "string_type", payload: { min: null, max: null }, location: location() } }
string_type =
    string_type_min_max
  / string_type_min
  / string_type_max
  / string_type_fixed
  / string_type_default

date_string_type = "DateString" { return { type: "date_string_type", payload: null, location: location() } }

integer_type_min_max = "integer" _ "(" _ "[" _ min:sint _ "," _ max:sint _ "]" _ ")" { return { type: "integer_type", payload: { min, max }, location: location() } }
integer_type_max     = "integer" _ "(" _ "[" _ "," _ max:sint _ "]" _ ")"            { return { type: "integer_type", payload: { min: null, max }, location: location() } }
integer_type_min     = "integer" _ "(" _ "[" _ min:sint _ "," _ "]" _ ")"            { return { type: "integer_type", payload: { min, max: null }, location: location() } }
integer_type_default = "integer"                                                     { return { type: "integer_type", payload: { min: null, max: null }, location: location() } }
integer_type =
    integer_type_min_max
  / integer_type_max
  / integer_type_min
  / integer_type_default

float_left  = t:("[?" / "[") _ f:(float / sint)? { return f ? [f, t === "[?" ? "open" : "closed"] : null }
float_right = f:(float / sint)? _ t:("?]" / "]") { return f ? [f, t === "?]" ? "open" : "closed"] : null }
float_type_bound   = "float" _ "(" _ left:float_left _ "," _ right:float_right _ ")" { return { type: "float_type", payload: { left, right }, location: location() } }
float_type_default = "float" { return { type: "float_type", payload: { left: null, right: null }, location: location() } }
float_type =
    float_type_bound
  / float_type_default

boolean_type = "boolean" { return { type: "boolean_type", payload: null, location: location() } }
null_type = "null" { return { type: "null_type", payload: null, location: location() } }

integer_literal_type = sint:sint { return { type: 'integer_literal_type', payload: { value: sint }, location: location() } }
float_literal_type   = float:float { return { type: 'float_literal_type', payload: { value: float }, location: location() } }
boolean_literal_type = boolean: boolean { return { type: 'boolean_literal_type', payload: { value: boolean }, location: location() } }
string_literal_type  = string:string { return { type: 'string_literal_type', payload: { value: string }, location: location() } }
literal_type = float_literal_type / integer_literal_type / boolean_literal_type / string_literal_type

dictionary_type = "{" _ f:(_ identifier _ "?"? _ ":" _ type _ ";" _)* _ "}"
{
  return {
    type: 'dictionary_type',
    payload: {
      properties: f.map((p: any) => ({
        identifier: p[1],
        optional: p[3] === "?",
        type: p[7]
      }))
    },
    location: location()
  }
}

named_tuple_type = "[" _ tn:identifier _ opt:"?"? _ ":" _ tt:type _ tr:( "," _ identifier _ "?"? _ ":" _ type _ )* "]"
{
  return {
    type: "named_tuple_type",
    payload: {
      elements: [
        {
          identifier: tn,
          optional: opt === "?",
          type: tt
        },
        ...tr.map((x: any) => ({
          identifier: x[2],
          optional: x[4] === "?",
          type: x[8]
        }))
      ]
    },
    location: location()
  }
}

tuple_type = "[" _ t1:type _ tr:( "," _ type _ )* "]"
{
  return {
    type: "tuple_type",
    payload: {
      elements: [t1, ...tr.map((x: any) => x[2])]
    },
    location: location()
  }
}

primitive_type = string_type / date_string_type / integer_type / float_type / boolean_type / null_type / literal_type / dictionary_type / named_tuple_type / tuple_type / enclosed_type / identifier

union_type = "&"? _ t1:primitive_type _ tr:(_ "&" _ primitive_type _)*
{
  return tr.length === 0 ? t1 : {
    type: 'union_type',
    payload: {
      types: [t1, ...tr.map((tn: any) => tn[3])]
    },
    location: location()
  }
} / primitive_type

intersection_type = "|"? _ t1:union_type _ tr:(_ "|" _ union_type _)*
{
 return tr.length === 0 ? t1 : {
   type: 'intersection_type',
   payload: {
     types: [t1, ...tr.map((tn: any) => tn[3])]
   },
   location: location()
 }
}
enclosed_type = "(" _ type: type _ ")"
{
  return {
    ...type,
    location: location()
  }
}