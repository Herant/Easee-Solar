using System.Collections;
using UnityEngine;

// Trigger Sequence by calling ToggleSolarSequence(float speed)
// In WebGL should be triggered on event/data update

public class SolarSequence : MonoBehaviour
{
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Alpha1))
        {
            ToggleSolarSequence(0.03f);
        }

        if (Input.GetKeyDown(KeyCode.Alpha0))
        {
            ToggleSolarPath();

        }
    }

    void ToggleSolarPath()
    {
        foreach (SpriteRenderer sprite in GetComponentsInChildren<SpriteRenderer>())
        {
            sprite.enabled = !sprite.enabled;
        }
    }

    void ToggleSolarSequence(float speed = 0.03f)
    {
        StartCoroutine(CounterCoroutine(speed));
    }

    private IEnumerator CounterCoroutine(float timeDelay)
    {
        SpriteRenderer[] sprite = GetComponentsInChildren<SpriteRenderer>();
        int pathSize = GetComponentsInChildren<SpriteRenderer>().Length;
        int index = 0;
        for (int i = 0; i < pathSize / 3; i++)
        {
            if (index < 3)
            {
                sprite[index].enabled = true;
                yield return new WaitForSeconds(timeDelay);
                sprite[index + 1].enabled = true;
                yield return new WaitForSeconds(timeDelay);
                sprite[index + 2].enabled = true;
                yield return new WaitForSeconds(timeDelay);
            }
            if (index < 27)
            {
                sprite[index + 3].enabled = true;
                sprite[index].enabled = false;
                yield return new WaitForSeconds(timeDelay);
                sprite[index + 4].enabled = true;
                sprite[index + 1].enabled = false;
                yield return new WaitForSeconds(timeDelay);
                sprite[index + 5].enabled = true;
                sprite[index + 2].enabled = false;
                yield return new WaitForSeconds(timeDelay);
            }

            if (index > 29)
            {
                sprite[index-3].enabled = false;
                sprite[index].enabled = true;
                yield return new WaitForSeconds(timeDelay);
                sprite[index - 2].enabled = false;
                sprite[index + 1].enabled = true;
                yield return new WaitForSeconds(timeDelay);
                sprite[index - 1].enabled = false;
                sprite[index + 2].enabled = true;
                yield return new WaitForSeconds(timeDelay);
                sprite[index + 3].enabled = true;
                yield return new WaitForSeconds(timeDelay);

                sprite[index].enabled = false;
                yield return new WaitForSeconds(timeDelay);
                sprite[index + 1].enabled = false;
                yield return new WaitForSeconds(timeDelay);
                sprite[index + 2].enabled = false;
                yield return new WaitForSeconds(timeDelay);
                sprite[index + 3].enabled = false;
                yield return new WaitForSeconds(timeDelay);
            }
            index += 3;
        }
    }
}
