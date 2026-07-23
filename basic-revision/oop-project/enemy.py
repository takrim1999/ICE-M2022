import random

class Enemy:
    def __init__(self, type_of_enemy, health_point, attack_point):
        self.__type_of_enemy:str = type_of_enemy
        self.health_points:int = health_point
        self.attack_points:int =attack_point

    def get_enemy_type(self):
        return self.__type_of_enemy

    def talk(self):
        print(f"""
        Hi There, I am your new enemy, I am a {self.__type_of_enemy},
        My health is now at {self.health_points}
        And I can attack at {self.attack_points} 
        """)

    def attack(self):
        print(f"{self.__type_of_enemy} is attacking for {self.attack_points}")


class Zombie(Enemy):

    def __init__(self):
        super().__init__("Zombie", 10, 1)

    def talk(self):
        print("Grambling")

    def spreading_infection(self):
        print("Spreading some infections")

    def special_ability(self):
        if random.random()<0.5:
            self.health_points += 2
            print("Zombie Health incresed by 2!")
class Ogre(Enemy):

    def __init__(self):
        super().__init__("Ogre", 20, 3)

    def talk(self):
        print("Orge Comming, Smashing everything!")

    def special_ability(self):
        if random.random()<0.2:
            self.attack_points += 4
            print("Ogre attack incresed by 4!")

# if __name__ == "__main__":
#     test = Enemy()
#     print(test.talk())