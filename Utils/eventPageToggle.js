
export function eventPageToggle(e, index, times, setTimes, user, availableOrMaybe){

    if(e == true){
        const newTimes = times.map(((t, i)=>{
            if(i == index){
                return({
                    available: (availableOrMaybe ? 
                        t.available.concat([{uid: user.uid, name:user.user}]) : 
                        t.available.filter((availablePerson) => availablePerson.uid != user.uid)) ,

                    maybe: (availableOrMaybe ? 
                        t.maybe.filter((maybePerson) => maybePerson.uid != user.uid) :
                        t.maybe.concat([{uid: user.uid, name:user.user}])) ,

                    date: t.date
                });
            }
            else{
                return t;
            }
          }))

        setTimes(newTimes);
    }
    else{
        const newTimes = times.map(((t, i)=>{
            if(i == index){
                return({
                    available: t.available.filter((availablePerson) => availablePerson.uid != user.uid),
                    maybe: t.maybe.filter((maybePerson) => maybePerson.uid != user.uid),
                    date: t.date
                }
                );
            }
            else{
                return t;
            }
          }))

        setTimes(newTimes);
    }     
}