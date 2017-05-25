Proyectos Gradle

* prueba - para pruebas y templates

## Requisitos:

   Para poder realizar la construccion del proyecto, es necesario realizar los siguientes pasos:

1. Ingresar con tu cuenta de LDAP a [JFROG](https://archive.it.lan.com/)
2. Presiona sobre tu nombre de usuario, que se encuentra en la parte superior derecha
3. Ingresa nuevamente tu contraseña y presiona en UNLOCK
4. En el campo `Encrypted Password`, presionar en el icono `show Encrypted Password` y almacenarla en algun editor
5. En tu `$HOME`, ingresar a la carpeta `gradle` y generar el archivo gradle.properties
6. Dentro del archivo ingresar
  * artifactory_user=`usuario`
  * artifactory_password=`la contraseña encriptada`
  * artifactory_contextUrl=https://archive.it.lan.com/artifactory

