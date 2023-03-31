import { WhoAmI, OnlyQuestions, BoxOfLies } from '../../components/acitivies';

const myColors = {
    green: '#30D158',
    red: '#FF0000',
    blue: '#2D31FA',
    orange: '#FF6D00',
    yellow: '#FFBA3C'
    // yellow: '#F1F200'
}

type ActivityType ={
    id: string,
    title: string,
    color: string,
    desc: string,
    layout: number,
    component?: any
    // iconUrl: string
}

type List = {
    picnic: ActivityType,

}


export const activitiesList:Object = {
    // picnic: {
    //     id: 'picnic',
    //     title: 'Let\’s have picnic',
    //     color: myColors.green,
    //     layout: 1,
    //     desc: 'Are you hungry? Gess what I have bring in my basket with me?'
    // },
    // amongUs: { 
    //     id: 'amongUs',
    //     title: 'Among us',
    //     color: myColors.red,
    //     layout: 1,
    //     desc: 'haha' 
    // },
    onlyQuestions: { 
        id: 'onlyQuestions',
        title: 'Was that question?',
        color: myColors.yellow,
        ico: 'ico1.svg',
        layout: 1,
        component: (init: any, videoGet: any, videoLetgo: any) => <OnlyQuestions init={init} videoGet={videoGet} videoLetgo={videoLetgo}/>,
        desc: 'Are you ready speak only in questions? You sad NO?'
    },
    whoAmI: { 
        id: 'whoAmI',
        title: 'You are him!',
        color: myColors.green,
        ico: 'ico3.svg',
        layout: 1,
        component: (init: any, videoGet: any, videoLetgo: any) => <WhoAmI init={init} videoGet={videoGet} videoLetgo={videoLetgo}/>,
        desc: 'I thought you are the person!'
    },
    boxOfLies: { 
        id: 'boxOfLies',
        title: 'Box of Lies',
        color: myColors.red,
        layout: 1,
        ico: 'ico2.svg',
        // eslint-disable-next-line react/jsx-no-undef
        component: (init: any, videoGet: any, videoLetgo: any) => <BoxOfLies init={init} videoGet={videoGet} videoLetgo={videoLetgo}/>,
        desc: 'Mistery box of unexpected insides'
    },
    // boxOfLies: { 
    //     id: 'boxOfLies',
    //     title: 'Box of lies ...',
    //     color: myColors.red,
    //     layout: 2,
    //     desc: 'Lies are my teritory. So what is in my box?'
    // },
    // test: {
    //     id: 'test',
    //     title: 'Test activity',
    //     color: myColors.green,
    //     desc: 'Testing activity'
    // }
}