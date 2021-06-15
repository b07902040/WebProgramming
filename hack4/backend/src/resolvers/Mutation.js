const Mutation = {
  async insertPeople(parent, args, { db }, info) {
    if ( db.people === null ) {
      return false;
    }
    for ( i = 0; i < args.data.length; i++ ) {
      var fil = await db.people.filter((val, key) => val.ssn === args.data[i].ssn);
      if ( fil >= 1 ) {
        var loc = ({ 
          name: args.data[i].location.name, 
          description: args.data[i].location.description
        });
        db.people[i].name = args.data[i].location.name;
        db.people[i].location = loc;
        db.people[i].severity = args.data[i].severity;
        return true;
      }
    }
    var loc = ({ 
      name: args.data[i].location.name, 
      description: args.data[i].location.description
    });
    var newPerson = ({
      ssn: args.data[i].ssn,
      name: args.data[i].name,
      location: loc,
      severity: args.data[i].severity,
    })
    await db.people.push(newPerson);
    return true;
  }
};

export { Mutation as default };
