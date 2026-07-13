# Carpeta de PDFs Integrados (Offline Assets) - CascoLegal

Todos los archivos PDF colocados en esta carpeta se compilarán directamente dentro de la aplicación móvil de Android (.apk) como "Assets estáticos".

Esto significa que cuando el usuario instale la aplicación, tendrá acceso inmediato y sin conexión a los textos legales originales de Panamá sin consumir datos móviles ni requerir internet.

### Archivos obligatorios para empaquetar en la app:
1.  **Decreto_Ejecutivo_640_2006.pdf** (Reglamento de Tránsito Vehicular).
2.  **Decreto_Ejecutivo_19_2022.pdf** (Decreto de Delivery de 2022).
3.  **Resolucion_OAL_904_2013.pdf** (Resolución de Chalecos de 2013).
4.  **Resolucion_OAL_973_2013.pdf** (Modificación de prendas reflectivas).

El visor de PDF nativo de la app móvil leerá los archivos directamente desde la memoria interna del teléfono usando la URI `expo-file-system`.
