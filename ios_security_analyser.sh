#!/bin/bash

# Farby pre výstup v termináli
RED="\033[1;31m"
GREEN="\033[1;32m"
CYAN="\033[1;36m"
YELLOW="\033[1;33m"
NC="\033[0m"

# Funkcia na odoslanie e-mailového varovania
send_email_alert() {
    echo -e "🚨 Bezpečnostná hrozba na vašom iPhone!\n\nViac info v prílohe." | mail -s "iOS Security Alert" -a ~/Analyse_Logs/security_report.log tvoje@email.com
}

# Hlavné menu
clear
echo -e "${CYAN}--------------------------------------${NC}"
echo -e "${RED}  🔍 Optimus Cyber Prime - iOS Security Guardian  🔍 ${NC}"
echo -e "${CYAN}--------------------------------------${NC}"

echo -e "${CYAN}1. Systémové informácie${NC}"
echo -e "${CYAN}2. Detekcia Jailbreaku${NC}"
echo -e "${CYAN}3. Kontrola škodlivých procesov${NC}"
echo -e "${CYAN}4. Analýza logov na neoprávnené vniknutia${NC}"
echo -e "${CYAN}5. Overenie integrity systému${NC}"
echo -e "${CYAN}6. Skenovanie aplikácií na škodlivý kód${NC}"
echo -e "${CYAN}7. Detekcia eSIM/SIM manipulácie${NC}"
echo -e "${CYAN}8. Export bezpečnostného reportu${NC}"
echo -e "${CYAN}9. Ukončiť skript${NC}"

echo -n -e "\n${YELLOW}Vyber možnosť: ${NC}"
read choice

case $choice in
  1)
    echo -e "\n${CYAN}📱 Systémové informácie:${NC}"
    uname -a
    sw_vers
    ;;
  2)
    echo -e "\n${CYAN}🔓 Detekcia Jailbreaku:${NC}"
    if [ -d "/private/var/lib/apt/" ] || [ -f "/Applications/Cydia.app/Cydia" ] || [ -f "/bin/bash" ]; then
      echo -e "${RED}⚠ Zariadenie je jailbreaknuté!${NC}"
      send_email_alert
    else
      echo -e "${GREEN}✅ Žiadne známky jailbreaku.${NC}"
    fi
    ;;
  3)
    echo -e "\n${CYAN}🛑 Kontrola škodlivých procesov:${NC}"
    ps aux | grep -E "sshd|Dropbear|Cydia|frida|checkra1n|unc0ver" | grep -v grep
    ;;
  4)
    echo -e "\n${CYAN}📜 Analýza logov na neoprávnené vniknutia:${NC}"
    log show --last 1h | grep -E "Failed|Error|denied|unauthorized|exploit|hack"
    ;;
  5)
    echo -e "\n${CYAN}🔐 Overenie integrity systému:${NC}"
    csrutil status
    ;;
  6)
    echo -e "\n${CYAN}🕵 Skenovanie aplikácií na škodlivý kód:${NC}"
    malicious_signatures=("malware" "trojan" "backdoor" "keylogger" "spyware")

    for app in /Applications/*.app; do
        binary=$(find "$app" -type f -perm +111 2>/dev/null)
        for sig in "${malicious_signatures[@]}"; do
            if strings "$binary" | grep -i "$sig"; then
                echo -e "${RED}⚠ Podozrivý kód v aplikácii $app: $sig${NC}"
                send_email_alert
            fi
        done
    done
    ;;
  7)
    echo -e "\n${CYAN}📶 Detekcia eSIM/SIM manipulácie:${NC}"
    echo -e "\n${CYAN}📲 Aktuálne dostupné eSIM:${NC}"
    ls /var/mobile/Library/Carrier\ Bundles/eSIM/
    echo -e "\n${CYAN}📜 História eSIM:${NC}"
    cat /var/mobile/Library/Carrier\ Bundles/eSIM/history.log 2>/dev/null || echo "Nie sú dostupné historické záznamy."
    ;;
  8)
    echo -e "\n${CYAN}💾 Export bezpečnostnej analýzy${NC}"
    mkdir -p ~/Analyse_Logs
    {
      uname -a
      sw_vers
      log show --last 1h | grep -E "Failed|Error|denied|unauthorized|exploit|hack"
    } > ~/Analyse_Logs/security_report.log
    send_email_alert
    ;;
  9)
    echo -e "${RED}Skript ukončený.${NC}"
    exit 0
    ;;
  *)
    echo -e "${RED}Neplatná voľba!${NC}"
    ;;
esac
