<!-- @lang fr -->

## Routes

### GET /api/colors/list
- Récupère la liste des couleurs
    - Permissions : admin ou visitor
    - Paramètres : filter (optionnel) : string égal à shiny_stock, matte_stock ou sanded_stock.
    - Réponse : { message: string, value: array }
        - message : message de succès ou d'erreur
        - value : liste des couleurs (vide si erreur)
### POST /api/colors/modifyStock/:id
- Modifie le stock d'une couleur
    - Permissions : admin, ou color_manager
    - Paramètres : id (obligatoire) : id de la couleur à modifier
    - Body : 
        - shiny_stock (0 ou 1)
        - matte_stock (0 ou 1)
        - sanded_stock (0 ou 1)
    - Réponse :
        - message : message de succès ou d'erreur

### POST /api/users/login
- Permet de se connecter
    - Permissions : aucune
    - Body :
        - username (obligatoire) : nom d'utilisateur
        - password (obligatoire) : mot de passe
    - Réponse : { message: string, status: number, value: object }
        - message : message de succès ou d'erreur
        - status : code HTTP
        - value : objet contenant le token et les informations de l'utilisateur (null si erreur)

### POST /api/users/addUser
- Permet de créer un utilisateur
    - Permissions : admin
    - Body :
        - username (obligatoire) : nom d'utilisateur
        - password (obligatoire) : mot de passe
        - description (optionnel) : description de l'utilisateur
    - réponse : { message: string, status: number, value: object }
        - message : message de succès ou d'erreur
        - status : code HTTP
        - value : objet contenant le token et les informations de l'utilisateur créé (null si erreur)
        