const christmaslottery = require("../services/christmaslottery");
christmasLottery.addParticipant("WiktorSłużbowy", "wazniewski.w@opsbielany.waw.pl", "dddddddddddddddddddd");
christmasLottery.addParticipant("c", "c@example.com", "opis bardzo chciiałbym dostać kucyka psa i jednonogiego pirata");
christmasLottery.addParticipant("d", "d@example.com", "//drugi -> co ma wstawiać jak trafi na pustą wartość, trzeci -> jak ma rozdzielać elementy (tabulacja) ");
christmasLottery.addParticipant("e", "e@example.com", "//drugi -> co ma wstawiać jak trafi na pustą wartość, trzeci -> jak ma rozdzielać elementy (tabulacja)  dddddddddddddddddddddd");
christmaslottery.runLottery();
const takenList = christmaslottery.getParticipantsList();
const listStingified = JSON.stringify(takenList, null, `\t`); //drugi -> co ma wstawiać jak trafi na pustą wartość, trzeci -> jak ma rozdzielać elementy (tabulacja) 
console.log(`otrzymany test: ` + listStingified );
