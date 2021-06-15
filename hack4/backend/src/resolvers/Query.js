const Query = {
  async statsCount(parent, args, { db }, info) {
    var sever = -1;
    if (args.severity) {
      sever = args.severity;
    }
    var collections = db.people;
    if ( db.people === null ) {
      return null;
    }
    var ans = args.locationKeywords.map(
      (key) => collections.filter(
        ({ severity: sev, location: { description }}) =>
        description.includes(key) && sev >= sever
      ).length
    );
    console.log(ans)
    return ans;
  }
};

export { Query as default };