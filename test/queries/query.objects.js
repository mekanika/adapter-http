
module.exports = {

  single: {
    resource:'users', action: 'find',
    constraints:[
      {field:'name', operator:'eq', condition:'Moredecai'}
    ]

  },

  many: {
    resource:'users', action: 'find',
    constraints:[
      {field:'age', operator:'gt', condition:16},
      {field:'name', operator:'in', condition:['Mordecai','Rigbone']},
      {field:'cool', operator:'neq', condition:'Boo'},
      {field:'cool', operator:'nin', condition:['Smoo','obo']}

    ],
    display:{limit:10, offset:0}
  },

  display: {
    resource:'users', action:'find',
    constraints:[
    ],
    display: {
      limit:25,
      offset:50
    }
  },

  template: {
    resource:'users', action:'find',
    constraints:[
    ]
  }


};
