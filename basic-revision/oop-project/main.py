from enemy import Zombie, Ogre, Enemy


def battle(e1: Enemy, e2: Enemy):
    e1.talk()
    e2.talk()

    while e1.health_points>0 and e2.health_points>0:
        print("-------------")
        e1.special_ability()
        e2.special_ability()
        print(f"{e1.get_enemy_type()} has {e1.health_points} HP left")
        print(f"{e2.get_enemy_type()} has {e2.health_points} HP left")
        e1.attack()
        e2.health_points -= e1.attack_points
        e2.attack()
        e1.health_points -= e2.attack_points
    if e1.health_points > 0:
        print(f"{e1.get_enemy_type()} Won!")
    else:
        print(f"{e2.get_enemy_type()} Won!")

enemy1 = Zombie()
enemy2 = Ogre()


battle(enemy1,enemy2)
