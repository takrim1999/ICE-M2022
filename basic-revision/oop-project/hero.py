from weapon import Weapon

class Hero:
    def __init__(self, health_point, attack_damage):
        self.health_point = health_point
        self.attack_damage = attack_damage
        self.is_weapon_equipped = False
        self.weapon: Weapon = None

    def equip_weapon(self):
        if self.is_weapon_equipped:
            self.is_weapon_equipped = True
            self.attack_damage += self.weapon.attack_increase

    def attack(self):
        print(f"Hero Attacks for {self.attack_damage} damage")
