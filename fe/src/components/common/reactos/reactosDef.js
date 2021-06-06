const allReactos =
[
    {
        "token": "((r.dt.year))",
        "desc": "Shows current year e.g. 2019, 2022 etc",
        "test": "Current year is ((r.dt.year))"
    },
    {
        "token": "((r.dt.month))",
        "desc": "Shows current month e.g. February, November etc",
        "test": "Current month is ((r.dt.month))"
    },
    {
        "token": "((r.dt.day))",
        "desc": "Shows current day e.g. Sunday, Friday etc",
        "test": "Today is ((r.dt.day))"
    },
    {
        "token": "((r.dt.date))",
        "desc": "Shows today's date e.g. 9, 21 etc",
        "test": "Today is ((r.dt.date))th day of ((r.dt.month))"
    },
    {
        "token": "((r.dt.hour))",
        "desc": "Shows current hour in 12 hours format e.g. 7, 11 etc",
        "test": "Current time is ((r.dt.hour)):((r.dt.min)):((r.dt.sec))"
    },
    {
        "token": "((r.dt.hour24))",
        "desc": "Shows current hour in 24 hours format e.g. 19, 22 etc",
        "test": "Current time in 24 hour format is ((r.dt.hour24)):((r.dt.min)):((r.dt.sec))"
    },
    {
        "token": "((r.dt.min))",
        "desc": "Shows current min e.g. 32, 55 etc",
        "test": "It is currently ((r.dt.min)) minutes past ((r.dt.hour))"
    },
    {
        "token": "((r.dt.sec))",
        "desc": "Shows current sec e.g. 3, 19 etc",
        "test": "Current time is ((r.dt.hour):((r.dt.min):((r.dt.sec))"
    },
    {
        "token": "((r.cfg.langSwitch.L))",
        "desc": "Changes the Reactos language. L=en, beng or any language code, e.g ((r.cfg.langSwitch.beng)) for Bengali etc",
        "test": `In Bengali today is ((r.cfg.langSwitch.beng))((r.dt.day))
        in English today is ((r.cfg.langSwitch.en))((r.dt.day))`
    },
    {	
        "token": "((r.var.k1=v1))",
        "desc": "To set any custom variable (e.g reader's name / hobby / choice-selection etc) to be used later",
        "test": `Set the variables and then Get the variables. 
        ((r.var.name=Barry Allen))((r.var.superheroName=The Flash))((r.var.tagLine=The Fastest man alive)) 
        
        Hello ((r.var.name)), I know you are ((r.var.tagLine))! 
        You are ((r.var.superheroName))...`
    },
    {	
        "token": "((r.var.name1))",
        "desc": "To get any previously SET value",
        "test": `Set the variables and then Get the variables. 
        ((r.var.name=Tony Stark))((r.var.superheroName=Iron Man))((r.var.tagLine=genius billionaire playboy philanthropist)) 
        
        Hello ((r.var.name)), I know you are a ((r.var.tagLine))! You are ((r.var.superheroName))...`
    },
    {	
        "token": "((r.if. n1 = n2))",
        "desc": "n1, n2 can be numbers or reactos. Equality operator can be anyone of =, !=, >, !>, <, !<. If the condition is true then the following reacto or body text inside double curly braces i.e. {{ ... }} will be executed, else not",
        "test":               
        `   ((r.if. 5 > 9)) {{ This line should not be shown }}
            ((r.if. 9 < r.dt.year ))
            {{ Yes, ((r.dt.year)) is always Greater than 9. ((r.var.secret_message = Reacto is Awesome )) }}
            ((r.if. 2 = 2)) 
            {{ Number comparison successful }}
            ((r.if. r.var.secret_message = Reacto is Awesome)) 
            {{ Text comparison successful }}
        `
    },
    {	
        "token": "((r.calc. n1 + n2))",
        "desc": "n1, n2 can be numbers or reactos. Maths operator can be anyone of the basic four, i.e. + , - , * and / ",
        "test":               
        `   4 + 5 = ((r.calc. 4 + 5))
            5 - 3 = ((r.calc. 5 - 3))
            3 * 2 = ((r.calc. 3 * 2))
            20 / 5 = ((r.calc. 20 / 5))
        `
    }
]

export default allReactos