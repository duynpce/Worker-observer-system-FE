# worker-observer-system-fe
context :

    - a 30-worker industrial laundry processing 2 tonnes of hotel linen per day across 6 stations : receiving, sorting, washing, drying, ironing/folding, packing/dispatch 
    - Workers track item counts and batch numbers on paper. 
    - a floor manager walks the floor every 90 minutes and reconstructs the day at end-of-shift. The owner sees a weekly Excel report
    - Workers speak the local language with mixed literacy. Phones are personal but Wi-Fi is patchy
    - the procudure cannot be changed, but the tools can be improved.
    - each worker station has each way of tracking the quantity of items processed such as : a whiteboard, a notebook, a tally counter, a pen and paper, a spreadsheet on a computer, etc.
    - there is only one shared device for each station
    - workers cannot login using a username and password due to their dirty hands during the work, and the shared device cannot be used for login/logout. Therefore, the system needs to be designed to allow workers to track their work without the need for login/logout, and to ensure that the data is accurately recorded and attributed to the correct worker and station

Problem :

    - the floor manager does not know what's happening in real time on the floor, To find out, they walk.They ask workers questions. They flip through ledgers
    .They take photos of whiteboards on their phone. They reconstruct the day at the end of the shift, sometimes the next morning, sometimes never 
    - When something goes wrong — a batch is late, an item is damaged, a station is bottlenecked, a worker is absent and nobody notices 
    the manager finds out hours after the fact. By then the damage is already downstream.
    - The owner or operations director above the manager has it worse. They get a weekly summary, often hand-typed into Excel from paper ledgers, often with errors, often a week late

Solution :
    
    - a observer system to manage the floor in real time, to track the flow of items through the stations using QR codes, to identify bottlenecks and issues as they happen, and to provide accurate data for reporting and decision making.

Features : 
    
    QR code tracking : each worker will has a unique QR code on their card, and they can use their card to check attendance (prevent unrecorded absences) and delare the numbers of Items they have processed.
    floor manager : also use QR codes ,a dashboard to show the floor data, a notification system to alert the manager of any issues, and a reporting system to provide accurate data for decision making.

