const Mutation = {
  async insertPeople(parent, args, { db }, info) {
    if ( db.people === null ) {
      return false;
    }
    args.data.forEach((per) => {
      const fil = db.people.findIndex((ssn) => ssn.ssn === per.ssn);
      if ( fil !== -1 ) {
        db.people[fil] = per;
      }
      else db.people.push(per);
    });
    
    return true;
  }
};

export { Mutation as default };
