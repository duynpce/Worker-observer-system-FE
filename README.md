    worker-observer-sysem
introduction :
    
    - this project was created for a technical challenge, done by only one person
    - with limited time and resources : only in 4.5 days (night of 9th to morning of 14th may 2026) 
    - the goal was to design and implement a system to manage the floor of an industrial laundry in real time

context :

    - a company with a 30-worker industrial laundry processing 2 tonnes of hotel linen per day across 6 stations : receiving, sorting, washing, drying, ironing/folding, packing/dispatch 
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
    - floor manager has no real-time data of which station a item is at

Solution :
    
    - a observer system to manage the floor in real time  using QR codes:
        - to track the flow of items through the stations
        - to track the attendance and performance of workers
        - to provide real-time data and insights to the floor manager and owner for better decision making and problem-solving.
        - to report any issues or bottlenecks in the process and alert the manager in real time(updating)
Features : 
    
    - each worker will has a unique QR code on their card, and they can use their card to check attendance (prevent unrecorded absences) and delare the numbers of Items they have processed.
    - floor manager also use QR codes ,a dashboard to show the floor data, a notification system(updating) to alert the manager of any issues, and a reporting system to provide accurate data for decision making.
    - items are tracked through the stations using QR codes, allowing the manager to see in real time where each item is in the process and identify any bottlenecks or issues.

Demo:

    - using QR to check attendance and declare the numbers of items processed by workers
        - Link : https://www.youtube.com/watch?v=-x0VS_4JW4w

    - using QR to track the flow of items through the stations
        - Link : https://www.youtube.com/watch?v=ARuQLcPc5gI

project's details:
    
    - Workflow : 
        - backend :
           - client --> controller --> service -> validation --> repository --> database
        - frontend :
            - big component --> subcomponent --> component's hooks(hook for state and effects, only for its component) 
                --> domain hooks(hooks for business logic, used in multiple components) --> service(API calls) 
    
    - Techstack :
        - backend : Spring Boot.
        - frontend : React .
        - database : PostgreSQL.

how to run the project :

    required environment :
        Runtime/Language: ( Node.js 24 and  Java 21)
        Database: (PostgreSQL 18 )
        Package Manager: (npm and Maven)
        spring boot version : 3.5.14
        react version : 19.2.14 with vite 8.0.10

    after cloning the project, you can run the backend and frontend separately by following the instructions below:
    
    - backend :
        - create your own application.yaml or just rename the application-ci to application.yaml
        - navigate to the backend directory and run the following command to start the Spring Boot application:
            - on linux/mac : `./mvnw spring-boot:run` (not quite sure, because I have only tested it on windows)
            - on windows : `./mvnw.cmd spring-boot:run`
    - frontend :
        - navigate to the frontend directory and run the following command to start the React application:
            - `npm install` to install the dependencies
            - `npm run dev` to start the development server

    QR code for account: format : "${worker 's UUID} ${password}"
    QR code for item: format : "${item's UUID}"

    
    