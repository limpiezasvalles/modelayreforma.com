# Licencias de la música de los vídeos

Registro de las pistas usadas en los vídeos de Modela y Reforma que se publican en YouTube.
Los archivos de audio **no** están en este repositorio: viven en `~/Videos/modela_web/_trabajo/music/`.

Las tres pistas están publicadas bajo **CC0 1.0 (dominio público)**: permiten uso comercial, copia, modificación y distribución sin pedir permiso y **sin obligación de atribución**. La licencia se comprobó el 2026-10-25 en la página de origen de cada pista (Freesound), no solo en el índice de Openverse.

| Pista | Autor | URL de origen | Licencia | Atribución | Descarga | Vídeos que la usan |
|-------|-------|---------------|----------|------------|----------|--------------------|
| **A** · «Lofi Fusion Background Music» (2:14, ~90 BPM) | Seth_Makes_Sounds | https://freesound.org/people/Seth_Makes_Sounds/sounds/655516/ | CC0 1.0 — https://creativecommons.org/publicdomain/zero/1.0/ | No obligatoria. Opcional: `"Lofi Fusion Background Music" by Seth_Makes_Sounds (freesound.org/s/655516), CC0 1.0` | 2026-10-25 | `0dd2e1e4-a81b-4a27-b7f9-adc712c569e9.mov`, `OFICINAS NOSTRALLAR.MP4`, `IMG_0733.MOV` |
| **B** · «Not To Notice» (2:29, ambiental, ~107 BPM) | Andrewkn | https://freesound.org/people/Andrewkn/sounds/504540/ | CC0 1.0 — https://creativecommons.org/publicdomain/zero/1.0/ | No obligatoria. Opcional: `"Not To Notice" by Andrewkn (freesound.org/s/504540), CC0 1.0` | 2026-10-25 | `0c5ede94-6ca9-4452-9a49-9aba12ab02c1.mov`, `ca81da9f-f912-43e7-bd45-5eb937e07b0f.mov`, `IMG_3966.MOV` |
| **C** · «MorningDue Piano.» (4:10, piano solo) | Bigvegie | https://freesound.org/people/Bigvegie/sounds/582038/ | CC0 1.0 — https://creativecommons.org/publicdomain/zero/1.0/ | No obligatoria. Opcional: `"MorningDue Piano." by Bigvegie (freesound.org/s/582038), CC0 1.0` | 2026-10-25 | `007bf2f5-cea3-4342-8b2e-2a7000e78b01.mov`, `IMG_1206.MOV` |

## Cómo se obtuvieron
- Búsqueda en la API pública de Openverse filtrando `license=cc0`, descarga de la previsualización MP3 (128 kbps) que sirve el CDN de Freesound. La descarga del original sin pérdida exige iniciar sesión en Freesound, así que no se usó.
- Se comprobó que no hay voz (detección con Whisper + VAD) y se midió el tempo.
- Huellas SHA-256 de los archivos usados:
  - A: `4d3a21b805ffcbb9841938aadceeb789b9b7066b88108ab1d836aa6d7585c65b`
  - B: `f8632b15ce60e404daf300a4a6b0338183c5ee6b22dcedd5672e0948ee162b02`
  - C: `e557d93e165f5fe7b24f5234d5f1d5d38792807f59c81d02419598a4035a9f13`

## Pistas descartadas
- «Low key background music fragment» (Clacksberg): la página de Freesound indica *This sound has been deleted*, no se puede verificar la licencia.
- No se consideraron pistas con otras licencias (CC BY, CC BY-NC…): la búsqueda se limitó a CC0/dominio público para no depender de atribuciones ni de restricciones comerciales.

## Aviso sobre Content ID
CC0 elimina el riesgo legal, pero **no impide que YouTube genere una reclamación automática errónea** si alguien ha registrado esa misma grabación en Content ID. Si ocurre, esta tabla (URL de origen + licencia CC0 verificable) es la prueba para disputar la reclamación.

## Cómo se procesó
Los 8 vídeos pasan por el mismo proceso: el audio original se elimina por completo (sin conservar voz ni ruido de obra) y solo queda música. Reparto por orden de aparición en la web: C, B, A, B, A, C, B, A (nunca la misma pista en dos vídeos seguidos).

Vídeo copiado sin recodificar (`-c:v copy`); audio original eliminado y sustituido por la pista recortada a la duración del vídeo, fundido de entrada 0,5 s y de salida 1 s, normalizada a −16 LUFS (true peak ≤ −1 dBTP), AAC 192 kbps, `+faststart`.
