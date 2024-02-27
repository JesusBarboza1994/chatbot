export const chat_functions = [
  {
      "type": "function",
      "function": {
          "name": "ask_api",
          "description": "Use this function to answer user questions about a helicoidal spring database. Deberás preguntar por todos los valores que necesitas y mostrar como resultado un JSON.",
          "parameters": {
              "type": "object",
              "properties": {
                  "brand": {
                      "type": "string",
                      "description": "Este valor es la marca de autos asociada al producto. Debe ser consultado. Siempre irá en mayúsculas y deberás corregirlo en caso el usuario lo escriba mal.",
                  },
                  "model": {
                    "type": "string",
                    "description": "Este valor es el modelo del auto asociado a la marca. Debe ser consultado. Siempre irá en mayúsculas y deberás corregirlo en caso el usuario lo escriba mal.",
                  },
                  "year": {
                    "type": "string",
                    "description": "Es el año de fabricación del vehículo. Debe ser consultado."
                  },
                  "position": {
                    "type": "string",
                    "description": "Es la posición del resorte requerido para el vehículo. Solo puede tener dos valores: 'POST' que se escribe si es posterior o 'DEL' que se escribe si es delantero. Debe ser consultado."
                  },
                  "version":{
                    "type": "string",
                    "description": "Es la versión del producto requerido. Debe ser consultado y sus valores solo podrán ser:  Original, y Reforzado si la posición es DEL; o Original, GLP, GNV3, GNV4, GNV5 si es POST. Le puedes dar las opciones si el usuario lo solicita."
                  }

              },
              "required": ["brand", "model", "year"]
          },
      }
  },
  {
      "type": "function",
      "function": {
          "name": "create_order",
          "description": "Si el cliente acepta el producto se procede con la creación de un pedido para el cliente.",
          "parameters": {
              "type": "object",
              "properties": {
                  "quantity": {
                      "type": "string",
                      "description": "Por defecto es 2. Se debe preguntar al cliente la cantidad de resortes que desea comprar.",
                  },
                  "osis_code": {
                    "type": "string",
                    "description": "Extraer de la respuesta anterior al cliente el osis_code que se muestra.",
                  }
                },
                "required": ["quantity", "osis_code"]
            },
        }
  }
]